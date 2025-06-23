import { AlertType } from "@prisma/client";
import TelegramBot from "node-telegram-bot-api";

// Initialize the bot with your token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
  polling: false,
});

export interface TelegramUser {
  id: string;
  chatId: number;
  name?: string;
  email?: string;
}

export class TelegramService {
  private static instance: TelegramService;
  private bot: TelegramBot;

  private constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
    }
    this.bot = new TelegramBot(token, { polling: false });
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  /**
   * Send an alert notification to a user via Telegram
   */
  async sendAlertNotification(
    chatId: number,
    alert: {
      type: string;
      severity: string;
      message: string;
      user: { name?: string; email?: string };
      latitude?: number;
      longitude?: number;
      createdAt: Date;
    }
  ): Promise<void> {
    try {
      const severityEmoji = this.getSeverityEmoji(alert.severity);
      const typeEmoji = this.getAlertTypeEmoji(alert.type);

      const message = this.formatAlertMessage(alert, severityEmoji, typeEmoji);

      await this.bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });

      console.log(
        `✅ Telegram notification sent to chat ${chatId} for alert: ${alert.type}`
      );
    } catch (error) {
      console.error(
        `❌ Failed to send Telegram notification to chat ${chatId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Send a welcome message to a new user
   */
  async sendWelcomeMessage(chatId: number, userName?: string): Promise<void> {
    try {
      const message = `
🎉 <b>Welcome to the Alarm App!</b>

Hi ${
        userName || "there"
      }! You've been successfully connected to our emergency alert system.

<b>What you'll receive:</b>
🚨 Fall detection alerts
⏰ Immobility warnings  
🗺️ Route deviation notifications
⚠️ Manual emergency triggers

<b>Alert Severity Levels:</b>
🔴 <b>CRITICAL</b> - Immediate emergency response required
🟠 <b>HIGH</b> - Urgent attention needed
🟡 <b>MEDIUM</b> - Important but not urgent
🔵 <b>LOW</b> - Informational alert

You'll receive real-time notifications whenever an alert is triggered for your account.

Stay safe! 🛡️
      `.trim();

      await this.bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });

      console.log(`✅ Welcome message sent to chat ${chatId}`);
    } catch (error) {
      console.error(
        `❌ Failed to send welcome message to chat ${chatId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Test the bot connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.bot.getMe();
      return true;
    } catch (error) {
      console.error("❌ Telegram bot connection test failed:", error);
      return false;
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case "CRITICAL":
        return "🔴";
      case "EMERGENCY":
        return "🟠";
      case "WARNING":
        return "🟡";
      case "WATCH":
        return "🟢";
      case "ADVISORY":
        return "🔵";
      case "INFO":
        return "⚪";
      default:
        return "⚪";
    }
  }

  private getAlertTypeEmoji(type: AlertType): string {
    switch (type) {
      case AlertType.SEVERE_WEATHER_WARNING:
        return "⛈️";
      case AlertType.FLOOD_WARNING:
        return "🌊";
      case AlertType.TORNADO_WARNING:
        return "🌪️";
      case AlertType.HURRICANE_WARNING:
        return "🌀";
      case AlertType.EARTHQUAKE_ALERT:
        return "🌋";
      case AlertType.TSUNAMI_WARNING:
        return "🌊";
      case AlertType.WILDFIRE_ALERT:
        return "🔥";
      case AlertType.CIVIL_EMERGENCY:
        return "🚨";
      case AlertType.AMBER_ALERT:
        return "🚨";
      case AlertType.SILVER_ALERT:
        return "👴";
      case AlertType.TERRORISM_ALERT:
        return "⚠️";
      case AlertType.HAZMAT_INCIDENT:
        return "☣️";
      case AlertType.INFRASTRUCTURE_FAILURE:
        return "🏗️";
      case AlertType.PUBLIC_HEALTH_EMERGENCY:
        return "🏥";
      case AlertType.EVACUATION_ORDER:
        return "🚪";
      case AlertType.SHELTER_IN_PLACE:
        return "🏠";
      case AlertType.ROAD_CLOSURE:
        return "🚧";
      case AlertType.POWER_OUTAGE:
        return "⚡";
      case AlertType.WATER_EMERGENCY:
        return "💧";
      default:
        return "📢";
    }
  }

  private formatAlertMessage(
    alert: {
      type: string;
      severity: string;
      message: string;
      user: { name?: string; email?: string };
      latitude?: number;
      longitude?: number;
      createdAt: Date;
    },
    severityEmoji: string,
    typeEmoji: string
  ): string {
    const userName = alert.user.name || alert.user.email || "Unknown User";
    const alertType = alert.type.replace("_", " ").toLowerCase();
    const time = new Date(alert.createdAt).toLocaleString();

    // Government emergency alert format
    let message = `
${typeEmoji} <b>EMERGENCY ALERT</b> ${severityEmoji}

<b>Alert Type:</b> ${alertType.toUpperCase()}
<b>Severity:</b> ${severityEmoji} ${alert.severity}
<b>Time:</b> ${time}
<b>Affected User:</b> ${userName}

<b>Message:</b>
${alert.message}
    `.trim();

    if (alert.latitude && alert.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
      message += `\n\n📍 <b>Location:</b> <a href="${googleMapsUrl}">View on Google Maps</a>`;
    }

    message += `\n\n⏰ <i>Alert ID: ${Date.now()}</i>`;
    message += `\n\n<b>This is an official emergency notification.</b>`;

    return message;
  }
}

export const telegramService = TelegramService.getInstance();
