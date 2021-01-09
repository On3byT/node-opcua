import * as path from "path";
import { OPCUAServer } from "..";
import * as should from "should";
import * as fs from "fs";

const certificateFolder = path.join(__dirname, "../../node-opcua-samples/certificates");
fs.existsSync(certificateFolder).should.eql(true, "expecting certificate store at " + certificateFolder);

describe("preventing server to start with invalid certificates/private key combination", () => {
    it("KP1: should raise a exception when attempting to start a server with key pair mistmatch", async () => {
        const certificateFile = path.join(certificateFolder, "server_cert_2048.pem");
        const privateKeyFile = path.join(certificateFolder, "server_key_1024.pem");

        fs.existsSync(certificateFile).should.eql(true);
        fs.existsSync(privateKeyFile).should.eql(true);

        const server = new OPCUAServer({
            certificateFile,
            privateKeyFile
        });

        let _err: any;
        try {
            await server.start();
        } catch (err) {
            _err = err;
        } finally {
            await server?.shutdown();
            server?.dispose();
        }
        should.exist(_err, "Expecting an exception in start !");
        _err.message.should.match(/the certificate and the private key do not match/);
    });
    it("KP2: should raise a warning when attempting to start a server with a key length <=1024", async () => {
        const certificateFile = path.join(certificateFolder, "server_cert_1024.pem");
        const privateKeyFile = path.join(certificateFolder, "server_key_1024.pem");

        fs.existsSync(certificateFile).should.eql(true);
        fs.existsSync(privateKeyFile).should.eql(true);

        const server = new OPCUAServer({
            certificateFile,
            privateKeyFile
        });
        await server.start();
        await server?.shutdown();
        server?.dispose();
    });
    it("KP3: should raise a warning when attempting to start a server with a out of date certificate", async () => {
        const certificateFile = path.join(certificateFolder, "server_cert_2048_outofdate.pem");
        const privateKeyFile = path.join(certificateFolder, "server_key_2048.pem");

        fs.existsSync(certificateFile).should.eql(true);
        fs.existsSync(privateKeyFile).should.eql(true);

        const server = new OPCUAServer({
            certificateFile,
            privateKeyFile
        });
        await server.start();
        await server?.shutdown();
        server?.dispose();
    });
    it("KP4: should raise a warning when attempting to start a server with a certificate that is not yet active", async () => {
        const certificateFile = path.join(certificateFolder, "server_cert_2048_not_active_yet.pem");
        const privateKeyFile = path.join(certificateFolder, "server_key_2048.pem");

        fs.existsSync(certificateFile).should.eql(true);
        fs.existsSync(privateKeyFile).should.eql(true);

        const server = new OPCUAServer({
            certificateFile,
            privateKeyFile
        });
        await server.start();
        await server?.shutdown();
        server?.dispose();
    });
});
