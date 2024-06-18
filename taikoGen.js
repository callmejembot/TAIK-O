const fs = require('fs');
const { ethers } = require('ethers');
const chalk = require('chalk');

const rpcUrl = 'https://rpc.ankr.com/taiko';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// Private key dari akun utama (gantilah dengan private key sesungguhnya)
const mainPrivateKey = 'YOUR_MAIN_PRIVATE_KEY_HERE';

// Fungsi utama untuk generate dan mengirim ETH ke wallet baru
async function generateAndSendEth() {
    try {
        // Generate sebuah wallet baru
        const wallet = ethers.Wallet.createRandom();

        // Ambil alamat dan private key dari wallet yang di-generate
        const address = wallet.address;
        const privateKey = wallet.privateKey;

        // Format data untuk disimpan ke dalam file generateWallet.txt
        const dataToSave = `${address}|${privateKey}\n`;

        fs.appendFileSync('generateWallet.txt', dataToSave);

        console.log(chalk.green(`Wallet baru berhasil dibuat dan data disimpan di generateWallet.txt`));

        // Mengirim 0.000001 ETH dari akun utama ke wallet yang di-generate
        await sendEthFromMainAccount(mainPrivateKey, address);
    } catch (error) {
        console.error(chalk.red('Error:', error));
    }
}

// Fungsi untuk mengirim ETH dari akun utama ke wallet yang di-generate
async function sendEthFromMainAccount(privateKey, toAddress) {
    try {
        const wallet = new ethers.Wallet(privateKey, provider);

        // Jumlah ETH yang akan dikirim (0.000001 ETH)
        const amountToSend = ethers.utils.parseEther('0.000001');

        // Gas limit dan gas price
        const gasLimit = 100000;
        const gasPrice = ethers.utils.parseUnits('1', 'gwei');

        console.log(chalk.yellow(`Mengirim 0.000001 ETH ke ${toAddress}...`));

        // Mengirim transaksi
        const tx = await wallet.sendTransaction({
            to: toAddress,
            value: amountToSend,
            gasLimit: gasLimit,
            gasPrice: gasPrice
        });

        console.log(chalk.green(`Transaksi berhasil dikirim: https://taikoscan.io/tx/${tx.hash}`));
    } catch (error) {
        console.error(chalk.red('Error:', error));
    }
}

// Fungsi untuk menjalankan proses secara berurutan
async function runSequentialProcess() {
    console.log(chalk.blue('Mulai looping untuk generate wallet dan kirim ETH...'));

    // Lakukan generate dan send ETH secara berurutan satu per satu
    while (true) {
        await generateAndSendEth();
        await sleep(30000); // Tunggu 30 detik sebelum proses berikutnya
    }
}

// Fungsi untuk menunggu dalam milidetik
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mulai proses berurutan
runSequentialProcess().catch(err => console.error(chalk.red('Error dalam proses utama:', err)));
