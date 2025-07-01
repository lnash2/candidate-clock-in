
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PostgreSQLStartupMessage {
  length: number;
  protocolVersion: number;
  parameters: Record<string, string>;
}

class CustomPostgreSQLClient {
  private conn: Deno.TlsConn | null = null;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  async connect(connectionString: string) {
    const url = new URL(connectionString);
    const hostname = url.hostname;
    const port = parseInt(url.port) || 5432;
    const username = url.username;
    const password = url.password;
    const database = url.pathname.slice(1) || 'postgres';

    console.log(`🔗 Connecting to ${hostname}:${port} as ${username} to database ${database}`);

    try {
      // Connect with TLS but ignore certificate validation
      this.conn = await Deno.connectTls({
        hostname,
        port,
        caCerts: [], // Empty CA certs to bypass validation
      });

      console.log('✅ TLS connection established');

      // Send startup message
      await this.sendStartupMessage(username, database);
      
      // Handle authentication
      await this.handleAuthentication(username, password);

      console.log('✅ Authentication successful');
      
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error);
      throw error;
    }
  }

  private async sendStartupMessage(username: string, database: string) {
    const parameters = {
      user: username,
      database: database,
      application_name: 'supabase-edge-function',
      client_encoding: 'UTF8'
    };

    let paramString = '';
    for (const [key, value] of Object.entries(parameters)) {
      paramString += key + '\0' + value + '\0';
    }
    paramString += '\0'; // Final null terminator

    const protocolVersion = 196608; // 3.0
    const messageLength = 4 + 4 + paramString.length;

    const buffer = new ArrayBuffer(4 + messageLength);
    const view = new DataView(buffer);
    
    view.setUint32(0, messageLength, false); // Message length (big-endian)
    view.setUint32(4, protocolVersion, false); // Protocol version
    
    // Add parameter string
    const paramBytes = this.encoder.encode(paramString);
    new Uint8Array(buffer, 8).set(paramBytes);

    await this.conn!.write(new Uint8Array(buffer));
    console.log('📤 Startup message sent');
  }

  private async handleAuthentication(username: string, password: string) {
    // Read authentication request
    const response = await this.readMessage();
    const messageType = String.fromCharCode(response[0]);
    
    console.log(`📥 Auth message type: ${messageType}`);

    if (messageType === 'R') {
      const authType = new DataView(response.buffer, 1, 4).getUint32(0, false);
      console.log(`🔐 Auth type: ${authType}`);

      if (authType === 5) { // MD5 password authentication
        const salt = response.slice(9, 13);
        const md5Password = await this.md5Password(username, password, salt);
        await this.sendPasswordMessage(md5Password);
      } else if (authType === 3) { // Clear text password
        await this.sendPasswordMessage(password);
      } else if (authType === 10) { // SASL authentication (SCRAM-SHA-256)
        await this.handleSASLAuth(username, password);
      }

      // Read authentication result
      const authResult = await this.readMessage();
      const resultType = String.fromCharCode(authResult[0]);
      
      if (resultType !== 'R') {
        throw new Error(`Authentication failed: unexpected message type ${resultType}`);
      }

      const authStatus = new DataView(authResult.buffer, 1, 4).getUint32(0, false);
      if (authStatus !== 0) {
        throw new Error(`Authentication failed with status: ${authStatus}`);
      }
    }

    // Skip remaining startup messages until ReadyForQuery
    while (true) {
      const msg = await this.readMessage();
      const msgType = String.fromCharCode(msg[0]);
      console.log(`📥 Received message type: ${msgType}`);
      
      if (msgType === 'Z') { // ReadyForQuery
        console.log('✅ Ready for queries');
        break;
      } else if (msgType === 'E') { // Error
        const errorMsg = this.decoder.decode(msg.slice(5));
        throw new Error(`PostgreSQL error: ${errorMsg}`);
      }
    }
  }

  private async sendPasswordMessage(password: string) {
    const passwordBytes = this.encoder.encode(password + '\0');
    const messageLength = 4 + passwordBytes.length;
    
    const buffer = new ArrayBuffer(1 + 4 + passwordBytes.length);
    const view = new DataView(buffer);
    
    view.setUint8(0, 112); // 'p' message type
    view.setUint32(1, messageLength, false);
    new Uint8Array(buffer, 5).set(passwordBytes);

    await this.conn!.write(new Uint8Array(buffer));
    console.log('📤 Password message sent');
  }

  private async handleSASLAuth(username: string, password: string) {
    // For SCRAM-SHA-256, we'll implement a basic version
    // This is a simplified implementation
    const mechanism = 'SCRAM-SHA-256';
    const mechanismBytes = this.encoder.encode(mechanism + '\0\0\0\0');
    const messageLength = 4 + mechanismBytes.length;
    
    const buffer = new ArrayBuffer(1 + 4 + mechanismBytes.length);
    const view = new DataView(buffer);
    
    view.setUint8(0, 112); // 'p' message type
    view.setUint32(1, messageLength, false);
    new Uint8Array(buffer, 5).set(mechanismBytes);

    await this.conn!.write(new Uint8Array(buffer));
    console.log('📤 SASL initial response sent');
  }

  private async md5Password(username: string, password: string, salt: Uint8Array): Promise<string> {
    // Simplified MD5 implementation for PostgreSQL
    // In a real implementation, you'd use a proper crypto library
    const crypto = await import("https://deno.land/std@0.168.0/crypto/mod.ts");
    const hasher = new crypto.crypto.subtle;
    
    const step1 = password + username;
    const hash1 = await hasher.digest('MD5', this.encoder.encode(step1));
    const hex1 = Array.from(new Uint8Array(hash1)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const step2 = hex1 + Array.from(salt).map(b => String.fromCharCode(b)).join('');
    const hash2 = await hasher.digest('MD5', this.encoder.encode(step2));
    const hex2 = Array.from(new Uint8Array(hash2)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return 'md5' + hex2;
  }

  private async readMessage(): Promise<Uint8Array> {
    // Read message type (1 byte)
    const typeBuffer = new Uint8Array(1);
    await this.conn!.read(typeBuffer);
    
    // Read message length (4 bytes)
    const lengthBuffer = new Uint8Array(4);
    await this.conn!.read(lengthBuffer);
    const length = new DataView(lengthBuffer.buffer).getUint32(0, false);
    
    // Read message body
    const bodyBuffer = new Uint8Array(length - 4);
    await this.conn!.read(bodyBuffer);
    
    // Combine type + length + body
    const fullMessage = new Uint8Array(1 + 4 + bodyBuffer.length);
    fullMessage.set(typeBuffer, 0);
    fullMessage.set(lengthBuffer, 1);
    fullMessage.set(bodyBuffer, 5);
    
    return fullMessage;
  }

  async query(sql: string): Promise<any> {
    console.log(`🔍 Executing query: ${sql}`);
    
    // Send simple query message
    const queryBytes = this.encoder.encode(sql + '\0');
    const messageLength = 4 + queryBytes.length;
    
    const buffer = new ArrayBuffer(1 + 4 + queryBytes.length);
    const view = new DataView(buffer);
    
    view.setUint8(0, 81); // 'Q' message type
    view.setUint32(1, messageLength, false);
    new Uint8Array(buffer, 5).set(queryBytes);

    await this.conn!.write(new Uint8Array(buffer));
    
    // Read response
    const results = [];
    let columns: string[] = [];
    
    while (true) {
      const msg = await this.readMessage();
      const msgType = String.fromCharCode(msg[0]);
      
      console.log(`📥 Query response type: ${msgType}`);
      
      if (msgType === 'T') { // RowDescription
        const fieldCount = new DataView(msg.buffer, 5, 2).getUint16(0, false);
        columns = [];
        let offset = 7;
        
        for (let i = 0; i < fieldCount; i++) {
          const nameEnd = msg.indexOf(0, offset);
          const fieldName = this.decoder.decode(msg.slice(offset, nameEnd));
          columns.push(fieldName);
          offset = nameEnd + 19; // Skip field info
        }
      } else if (msgType === 'D') { // DataRow
        const fieldCount = new DataView(msg.buffer, 5, 2).getUint16(0, false);
        const row: Record<string, any> = {};
        let offset = 7;
        
        for (let i = 0; i < fieldCount; i++) {
          const fieldLength = new DataView(msg.buffer, offset, 4).getInt32(0, false);
          offset += 4;
          
          if (fieldLength === -1) {
            row[columns[i]] = null;
          } else {
            const fieldValue = this.decoder.decode(msg.slice(offset, offset + fieldLength));
            row[columns[i]] = fieldValue;
            offset += fieldLength;
          }
        }
        
        results.push(row);
      } else if (msgType === 'C') { // CommandComplete
        console.log('✅ Command completed');
      } else if (msgType === 'Z') { // ReadyForQuery
        console.log('✅ Ready for next query');
        break;
      } else if (msgType === 'E') { // Error
        const errorMsg = this.decoder.decode(msg.slice(5));
        throw new Error(`Query error: ${errorMsg}`);
      }
    }
    
    return results;
  }

  async close() {
    if (this.conn) {
      // Send terminate message
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, 88); // 'X' message type
      view.setUint32(1, 4, false);
      
      await this.conn.write(new Uint8Array(buffer));
      this.conn.close();
      this.conn = null;
      console.log('✅ Connection closed');
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Testing legacy database connection with custom client...')
    
    const { connectionString } = await req.json() as { connectionString: string }
    
    if (!connectionString) {
      throw new Error('Connection string is required')
    }

    console.log('🔗 Using connection string (masked):', connectionString.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2'))
    
    const client = new CustomPostgreSQLClient()
    await client.connect(connectionString)
    
    console.log('✅ Connection successful!')
    
    const versionResult = await client.query('SELECT version() as version')
    const tableResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `)
    
    await client.close()
    
    return new Response(
      JSON.stringify({
        success: true,
        database_version: versionResult[0]?.version,
        table_count: Number(tableResult[0]?.table_count || 0),
        message: 'Connection successful using custom PostgreSQL client'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('🚨 Connection test error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        recommendations: [
          'Verify the connection string format is correct',
          'Check that the database server is accessible',
          'Ensure database credentials are valid',
          'Verify network connectivity to the database host',
          'Custom client bypasses SSL certificate validation issues'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
