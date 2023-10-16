// Unset
import {
    getGreetingAccount,
    incrementSendAndConfirm,
    decrementSendAndConfirm,
    initializeClient,
} from "./index";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

async function main(feePayer: Keypair) {
    const args = process.argv.slice(2);
    const connection = new Connection("https://api.devnet.solana.com", {
        commitment: "confirmed",
    });
    const progId = new PublicKey(args[0]!);

    initializeClient(progId, connection);
    // 0. Create keypair for the Greeting account
    const greetingAccount = Keypair.generate();
    console.info("+==== Greeting Address  ====+");
    console.info(greetingAccount.publicKey.toBase58());

    // 1. Increment the counter by 1
    await incrementSendAndConfirm({ signers: { feePayer, greetingAccount } });
    let incremented_account = await getGreetingAccount(greetingAccount.publicKey);
    
    // 2. Decrement the count by 1
    await decrementSendAndConfirm({ signers: { feePayer, greetingAccount } });
    let decremented_account = await getGreetingAccount(greetingAccount.publicKey);
    
    console.log((incremented_account?.counter ?? 0) - 1 === (decremented_account?.counter ?? + 1));
}

fs.readFile(path.join(os.homedir(), ".config/solana/id.json")).then((file) =>
    main(Keypair.fromSecretKey(new Uint8Array(JSON.parse(file.toString()))))
);
