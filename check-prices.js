const contentful = require("contentful-management");
async function run() {
    const client = contentful.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const env = await space.getEnvironment("master");
    
    const prices = await env.getEntries({ content_type: "priceItem" });
    prices.items.forEach(p => console.log(p.fields.title));
}
run().catch(console.error);
