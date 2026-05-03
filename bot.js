require('dotenv').config();
const http = require('http');

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder } = require('discord.js');

// Keep-alive server (7/24 aktif tutmak için)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running 24/7');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Keep-alive server running on port ${PORT}`);
});

const clientId = process.env.CLIENT_ID || '1474549608968622130';
const guildId = process.env.GUILD_ID || null;
const staffRoleName = process.env.STAFF_ROLE_NAME || 'patron';
const prefix = '!';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const findRoleByName = (guild, name) => guild.roles.cache.find(r => r.name.toLowerCase() === name.toLowerCase());

const commands = [
    new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sunucuda kayıt ve ticaret sistemini kurar'),
    new SlashCommandBuilder()
        .setName('hosgeldin')
        .setDescription('Hoş geldin mesajını ve kayıt seçeneklerini gösterir'),
    new SlashCommandBuilder()
        .setName('ticaret')
        .setDescription('Ticaret kanalı açma sistemi'),
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
    try {
        if (guildId) {
            console.log(`Registering guild commands for guild ${guildId}`);
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        } else {
            console.log('Registering commands for all guilds the bot is in');
            for (const guild of client.guilds.cache.values()) {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guild.id),
                    { body: commands },
                );
                console.log(`Registered commands in ${guild.id}`);
            }
        }
        console.log('Slash commands registered.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands();
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'setup') {
            const embed = new EmbedBuilder()
                .setTitle('🚀 TROLLZONE Sistem Kurulumu 🚀')
                .setDescription('Aşağıdaki butonlarla kayıt veya ticaret sistemini başlatabilirsiniz.')
                .setColor('#6b21a8');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('open_registration')
                        .setLabel('Kaydı Başlat')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('open_trade')
                        .setLabel('Ticaret Aç')
                        .setStyle(ButtonStyle.Success),
                );

            await interaction.reply({ embeds: [embed], components: [row] });
            return;
        }

        if (interaction.commandName === 'hosgeldin') {
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#6b21a8')
                .setTitle('🚀 TROLLZONE Registration 🚀')
                .setDescription('Kanalları görüntüleyebilmek için aşağıdaki seçeneklerden sana uygun olanı seçip kaydını tamamlayabilirsin!\n\nYou can complete your registration by selecting the option below that best suits you to gain access to the channels!')
                .addFields(
                    { name: 'Hoşgeldin!', value: 'Aşağıdan uygun seçeneği seçerek kaydını başlatabilirsin.' },
                );

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('welcome_selection')
                        .setPlaceholder('Select an option.')
                        .addOptions(
                            {
                                label: 'Ekibe Başvur!',
                                description: 'Join The Crew!',
                                value: 'team_apply',
                            },
                            {
                                label: 'Başka Bir VTC Üyesiyim!',
                                description: 'I\'m From Another VTC!',
                                value: 'other_vtc',
                            },
                            {
                                label: 'Ben Bir Misafirim!',
                                description: 'I\'m a Guest',
                                value: 'guest',
                            },
                        ),
                );

            await interaction.reply({ embeds: [welcomeEmbed], components: [row] });
            return;
        }

        if (interaction.commandName === 'ticaret') {
            const modal = new ModalBuilder()
                .setCustomId('trade_modal')
                .setTitle('Ticaret Bilgileri');

            const tradeInput = new TextInputBuilder()
                .setCustomId('trade_details')
                .setLabel('Ticaret detaylarını yazın')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Ne satıyorsunuz/alıyorsunuz? Detaylar...')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(tradeInput);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
            return;
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'open_registration') {
            const modal = new ModalBuilder()
                .setCustomId('vtc_modal')
                .setTitle('VTC Bilgileri');

            const vtcInput = new TextInputBuilder()
                .setCustomId('vtc_name')
                .setLabel('Başka bir VTC\'den mi geliyorsunuz? Hangi VTC?')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('VTC adını yazın veya "Hayır" yazın')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(vtcInput);
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
            return;
        }

        if (interaction.customId === 'open_trade') {
            const modal = new ModalBuilder()
                .setCustomId('trade_modal')
                .setTitle('Ticaret Bilgileri');

            const tradeInput = new TextInputBuilder()
                .setCustomId('trade_details')
                .setLabel('Ticaret detaylarını yazın')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Ne satıyorsunuz/alıyorsunuz? Detaylar...')
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(tradeInput);
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
            return;
        }

        if (interaction.customId === 'approve_ticket') {
            const userRole = findRoleByName(interaction.guild, staffRoleName);
            if (!interaction.member.roles.cache.has(userRole?.id)) {
                return await interaction.reply({ content: `Bu işlemi sadece ${staffRoleName} rolüne sahip kişiler yapabilir!`, ephemeral: true });
            }

            const memberId = interaction.message.embeds[0]?.footer?.text;
            if (!memberId) {
                return await interaction.reply({ content: 'Üye bilgisi bulunamadı.', ephemeral: true });
            }
            const member = await interaction.guild.members.fetch(memberId);
            const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'üye');
            if (role) {
                await member.roles.add(role);
                await interaction.reply({ content: 'Başvuru onaylandı ve rol verildi!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Üye rolü bulunamadı!', ephemeral: true });
            }
            return;
        }

        if (interaction.customId === 'close_ticket') {
            const userRole = findRoleByName(interaction.guild, staffRoleName);
            if (!interaction.member.roles.cache.has(userRole?.id)) {
                return await interaction.reply({ content: `Bu işlemi sadece ${staffRoleName} rolüne sahip kişiler yapabilir!`, ephemeral: true });
            }

            await interaction.reply({ content: 'Ticket kapatılıyor...', ephemeral: true });
            await interaction.channel.delete().catch(console.error);
            return;
        }
    }

        if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'welcome_selection') {
            const selected = interaction.values[0];
            if (selected === 'team_apply') {
                const staffRole = findRoleByName(interaction.guild, staffRoleName);
                if (!staffRole) {
                    return await interaction.reply({ content: `${staffRoleName} rolü bulunamadı. Lütfen sunucu yöneticisine haber verin.`, ephemeral: true });
                }

                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticaret-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: null,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: staffRole.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                    topic: `${staffRoleName} için özel ticaret başvuru kanalı`,
                });

                const embed = new EmbedBuilder()
                    .setTitle('Yeni Ticaret Başvurusu')
                    .setDescription(`Başvuru sahibi: ${interaction.user}\nSeçim: Ekibe Başvur!`)
                    .setColor('#ff9900')
                    .setFooter({ text: interaction.user.id });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('approve_ticket')
                            .setLabel('Onayla ve Rol Ver')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('close_ticket')
                            .setLabel('Kapat')
                            .setStyle(ButtonStyle.Danger),
                    );

                await ticketChannel.send({ embeds: [embed], components: [row] });
                await interaction.reply({ content: `Ticket açıldı: ${ticketChannel}. Sadece ${staffRoleName} rolündekiler görebilir.`, ephemeral: true });
                return;
            }

            if (selected === 'other_vtc') {
                const modal = new ModalBuilder()
                    .setCustomId('vtc_other_modal')
                    .setTitle('Başka VTC Bilgileri');

                const vtcInput = new TextInputBuilder()
                    .setCustomId('other_vtc_name')
                    .setLabel('Hangi VTC\'den geliyorsunuz?')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('VTC adını yazın...')
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(vtcInput);
                modal.addComponents(firstActionRow);
                await interaction.showModal(modal);
                return;
            }

            if (selected === 'guest') {
                let selectedText = 'Misafirim';

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('purpose_selection')
                            .setPlaceholder('Geliş amacını seç')
                            .addOptions(
                                {
                                    label: 'Ekibe katılmak için',
                                    description: 'Kryptron ekibine başvurmak istiyorum',
                                    value: 'join_team',
                                },
                                {
                                    label: 'Başka bir VTC için',
                                    description: 'Farklı bir VTC ile bağlantılıyım',
                                    value: 'other_vtc_reason',
                                },
                                {
                                    label: 'Sadece misafir olarak geldim',
                                    description: 'Sadece göz atmak istiyorum',
                                    value: 'just_guest',
                                },
                            ),
                    );

                await interaction.update({
                    content: `**Seçimin:** ${selectedText}\nŞimdi geliş amacını seçebilirsin.`,
                    embeds: [],
                    components: [row],
                });
                return;
            }
        }

        if (interaction.customId === 'purpose_selection') {
            const purpose = interaction.values[0];
            let purposeText = '';
            if (purpose === 'join_team') purposeText = 'Ekibe katılmak için geldin.';
            if (purpose === 'other_vtc_reason') purposeText = 'Başka bir VTC için geldin.';
            if (purpose === 'just_guest') purposeText = 'Sadece misafir olarak geldin.';

            await interaction.update({
                content: `✅ Kaydın alındı! ${purposeText} Artık yetkili ekip bunu görebilecek ve seni yönlendirecek.`,
                embeds: [],
                components: [],
            });
            return;
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'vtc_modal') {
            const vtcName = interaction.fields.getTextInputValue('vtc_name');
            const staffRole = interaction.guild.roles.cache.find(r => r.name === 'Yetkili');
            if (!staffRole) {
                return await interaction.reply({ content: 'Yetkili rolü bulunamadı!', ephemeral: true });
            }

            const ticketChannel = await interaction.guild.channels.create({
                name: `başvuru-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: staffRole.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle('Yeni Başvuru')
                .setDescription(`Başvuran: ${interaction.user}\nVTC: ${vtcName}`)
                .setFooter({ text: interaction.user.id });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('approve_ticket')
                        .setLabel('Onayla ve Rol Ver')
                        .setStyle(ButtonStyle.Success),
                );

            await ticketChannel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Başvurunuz alındı! Ticket kanalınız: ${ticketChannel}`, ephemeral: true });
            return;
        }

        if (interaction.customId === 'trade_modal') {
            const tradeDetails = interaction.fields.getTextInputValue('trade_details');
            const tradeChannel = await interaction.guild.channels.create({
                name: `ticaret-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle('Yeni Ticaret İlanı')
                .setDescription(`İlan Sahibi: ${interaction.user}\nDetaylar: ${tradeDetails}`)
                .setColor('#00ff00');

            await tradeChannel.send({ embeds: [embed] });
            await interaction.reply({ content: `Ticaret kanalınız oluşturuldu: ${tradeChannel}`, ephemeral: true });
            return;
        }

        if (interaction.customId === 'vtc_other_modal') {
            const vtcName = interaction.fields.getTextInputValue('other_vtc_name');
            const staffRole = findRoleByName(interaction.guild, staffRoleName);
            if (!staffRole) {
                return await interaction.reply({ content: `${staffRoleName} rolü bulunamadı. Lütfen sunucu yöneticisine haber verin.`, ephemeral: true });
            }

            const ticketChannel = await interaction.guild.channels.create({
                name: `vtc-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: staffRole.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
                topic: `${staffRoleName} için özel VTC başvuru kanalı`,
            });

            const embed = new EmbedBuilder()
                .setTitle('Yeni VTC Başvurusu')
                .setDescription(`Başvuran: ${interaction.user}\nGeldikleri VTC: ${vtcName}`)
                .setColor('#0099ff')
                .setFooter({ text: interaction.user.id });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('approve_ticket')
                        .setLabel('Onayla ve Rol Ver')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Kapat')
                        .setStyle(ButtonStyle.Danger),
                );

            await ticketChannel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `VTC başvurunuz alındı! Ticket kanalınız: ${ticketChannel}`, ephemeral: true });
            return;
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'setup') {
        const embed = new EmbedBuilder()
            .setTitle('🚀 TROLLZONE Sistem Kurulumu 🚀')
            .setDescription('Aşağıdaki butonlarla kayıt veya ticaret sistemini başlatabilirsiniz.')
            .setColor('#6b21a8');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_registration')
                    .setLabel('Kaydı Başlat')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('open_trade')
                    .setLabel('Ticaret Aç')
                    .setStyle(ButtonStyle.Success),
            );

        await message.reply({ embeds: [embed], components: [row] });
        return;
    }

    if (command === 'hosgeldin') {
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#6b21a8')
            .setTitle('🚀 TROLLZONE Registration 🚀')
            .setDescription('Kanalları görüntüleyebilmek için aşağıdaki seçeneklerden sana uygun olanı seçip kaydını tamamlayabilirsin!\n\nYou can complete your registration by selecting the option below that best suits you to gain access to the channels!')
            .addFields(
                { name: 'Hoşgeldin!', value: 'Aşağıdan uygun seçeneği seçerek kaydını başlatabilirsin.' },
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('welcome_selection')
                    .setPlaceholder('Select an option.')
                    .addOptions(
                        {
                            label: 'Ekibe Başvur!',
                            description: 'Join The Crew!',
                            value: 'team_apply',
                        },
                        {
                            label: 'Başka Bir VTC Üyesiyim!',
                            description: 'I\'m From Another VTC!',
                            value: 'other_vtc',
                        },
                        {
                            label: 'Ben Bir Misafirim!',
                            description: 'I\'m a Guest',
                            value: 'guest',
                        },
                    ),
            );

        await message.reply({ embeds: [welcomeEmbed], components: [row] });
        return;
    }

    if (command === 'ticaret') {
        const tradeDetails = args.join(' ') || 'Ticaret açıklaması verilmedi.';
        const tradeChannel = await message.guild.channels.create({
            name: `ticaret-${message.author.username}`,
            type: ChannelType.GuildText,
            parent: null,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: message.author.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        });

        const embed = new EmbedBuilder()
            .setTitle('Yeni Ticaret İlanı')
            .setDescription(`İlan Sahibi: ${message.author}\nDetaylar: ${tradeDetails}`)
            .setColor('#00ff00');

        await tradeChannel.send({ embeds: [embed] });
        await message.reply({ content: `Ticaret kanalınız oluşturuldu: ${tradeChannel}` });
        return;
    }
});

client.login(process.env.TOKEN);