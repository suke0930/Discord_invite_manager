import { Client, GatewayIntentBits, Guild } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

// 設定ファイルの型定義
interface Config {
    token: string;
}

// 設定ファイルを読み込む関数
function loadConfig(): Config {
    const configPath = path.join(__dirname, 'config.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData) as Config;
}

// サーバーごとの初期化処理
async function initializeGuild(guild: Guild): Promise<void> {
    console.log(`サーバー「${guild.name}」の初期化を開始します...`);

    // ここにサーバーごとの初期化処理を実装
    // 例: チャンネルの作成、ロールの設定など

    console.log(`サーバー「${guild.name}」の初期化が完了しました。`);
}

// メイン関数
async function main(): Promise<void> {
    try {
        // 設定の読み込み
        const config = loadConfig();

        // Discordクライアントの初期化
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        // ログインイベント
        client.once('ready', async () => {
            console.log(`${client.user?.tag}としてログインしました！`);

            // 参加している全サーバーの初期化
            for (const guild of client.guilds.cache.values()) {
                await initializeGuild(guild);
            }
        });

        // エラーハンドリング
        client.on('error', (error) => {
            console.error('Discordクライアントでエラーが発生しました:', error);
        });

        // ログイン
        await client.login(config.token);

    } catch (error) {
        console.error('プログラムの実行中にエラーが発生しました:', error);
        process.exit(1);
    }
}

// プログラムの実行
main().catch(console.error);
