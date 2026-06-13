const contentful = require("contentful-management");

async function run() {
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const env = await space.getEnvironment("master");

    const regulations = await env.getEntries({ content_type: "regulationEntry" });
    const locale = "pl";

    console.log("=== REGULATIONS ===");
    const mapped = regulations.items.map(item => {
        const fields = Object.keys(item.fields).reduce((acc, key) => {
            acc[key] = item.fields[key][locale] || Object.values(item.fields[key])[0];
            return acc;
        }, {});
        return {
            sys: { id: item.sys.id },
            fields: fields
        };
    }).sort((a, b) => (a.fields.order || 0) - (b.fields.order || 0));
    console.log(JSON.stringify(mapped, null, 2));
}

run().catch(console.error);
