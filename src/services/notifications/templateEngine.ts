
import { NotificationTemplateData, TemplateEngine } from './types';

export class SimpleTemplateEngine implements TemplateEngine {
  render(template: string, data: NotificationTemplateData): string {
    let result = template;
    
    // Replace all {{key}} occurrences with their values
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(data[key]));
    });
    
    return result;
  }
}

export const templateEngine = new SimpleTemplateEngine();
