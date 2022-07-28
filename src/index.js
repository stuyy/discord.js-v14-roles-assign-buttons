import { config } from 'dotenv';
config();
import {
  Client,
  GatewayIntentBits,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { REST } from '@discordjs/rest';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '997820362446340096';

/**
 * replace with button custom Id, mapping to the role id
 * e.g: announcementRole: 'role id for announcement role'
 */
const ROLES = {
  BLUE: '',
  RED: '',
  GREEN: '',
  PURPLE: '',
  PINK: '',
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

const commands = [];

client.on('ready', async () => {
  console.log('Bot is online');
  // Uncomment this to get the message sent to your channel
  // const channel = client.channels.cache.get('enter your channel id here');
  // console.log(channel);
  // channel.send({
  //   content: 'Select your role by clicking on a button',
  //   components: [
  //     new ActionRowBuilder().setComponents(
  //       new ButtonBuilder()
  //         .setCustomId('blue')
  //         .setLabel('Blue')
  //         .setStyle(ButtonStyle.Primary),
  //       new ButtonBuilder()
  //         .setCustomId('red')
  //         .setLabel('Red')
  //         .setStyle(ButtonStyle.Primary),
  //       new ButtonBuilder()
  //         .setCustomId('green')
  //         .setLabel('Green')
  //         .setStyle(ButtonStyle.Primary),
  //       new ButtonBuilder()
  //         .setCustomId('pink')
  //         .setLabel('Pink')
  //         .setStyle(ButtonStyle.Primary),
  //       new ButtonBuilder()
  //         .setCustomId('purple')
  //         .setLabel('Purple')
  //         .setStyle(ButtonStyle.Primary)
  //     ),
  //   ],
  // });
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    const role = interaction.guild.roles.cache.get(
      ROLES[interaction.customId.toUpperCase()] // the button's custom Id MUST match your ROLES property defined above
    );

    if (!role)
      return interaction.reply({ content: 'Role not found', ephemeral: true });

    const hasRole = interaction.member.roles.cache.has(role.id);
    console.log(hasRole);

    if (hasRole)
      return interaction.member.roles
        .remove(role)
        .then((member) =>
          interaction.reply({
            content: `The ${role} role was removed to you ${member}`,
            ephemeral: true,
          })
        )
        .catch((err) => {
          console.log(err);
          return interaction.reply({
            content: `Something went wrong. The ${role} role was not removed to you ${member}`,
            ephemeral: true,
          });
        });
    else
      return interaction.member.roles
        .add(role)
        .then((member) =>
          interaction.reply({
            content: `The ${role} role was added to you ${member}`,
            ephemeral: true,
          })
        )
        .catch((err) => {
          console.log(err);
          return interaction.reply({
            content: `Something went wrong. The ${role} role was not added to you ${member}`,
            ephemeral: true,
          });
        });
  }
});

async function main() {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
