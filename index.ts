import 'dotenv/config'

import { App, subtype } from '@slack/bolt';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, 
    appToken: process.env.SLACK_APP_TOKEN 
});

const pull_block = (channel: string) => [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `Joku teki uuden pull requestin ja siitä tuli ilmoitus ${channel} kanavalle. \n\nKävisikö joku katsomassa sen läpi ettei se jää roikkumaan 🥺👉🏻👈`
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Joo"
                },
                "style": "primary",
                "value": "click_me_123",
                "action_id": "button_click"
            }
        ]
    }
]

app.action('button_click', async ({ ack, body, say}) => {
    await ack();
    await say(`<@${body.user.id}> kiitos 🥺`);
});

app.message(async ({ message }) => {
    // @ts-ignore
    if (message.bot_profile?.name == 'GitHub') {
        //@ts-ignore
        if (message.attachments[0]?.pretext.includes('Pull request opened') || message.attachments[0]?.pretext.includes('Pull request reopened')) {
            const channel = await app.client.conversations.info({ channel: message.channel });
            app.client.chat.postMessage({channel: process.env.GENERAL_ID!, blocks: pull_block(channel.channel?.name ?? '(nyt en ees tiiä)'), text: 'Voisko joku pliis?🥺'});
        }
    }
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Slack bot running!');
  })();
