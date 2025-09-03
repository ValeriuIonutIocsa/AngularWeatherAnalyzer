import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {

    const supabaseProjectUrl = process.env['SUPABASE_PROJECT_URL'];
    const supabaseApiKey = process.env['SUPABASE_API_KEY'];
    
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            supabaseProjectUrl: supabaseProjectUrl, 
            supabaseApiKey: supabaseApiKey 
        }),
    };
};
