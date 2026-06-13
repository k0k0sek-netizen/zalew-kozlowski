const contentful = require("contentful-management");

async function run() {
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const env = await space.getEnvironment("master");

    const [prices, infoBlocks] = await Promise.all([
        env.getEntries({ content_type: "priceItem" }),
        env.getEntries({ content_type: "infoBlock" }),
    ]);

    const locale = "pl"; // or default locale

    console.log("=== PRICES FALLBACK DATA ===");
    const pricesMapped = prices.items.map(p => {
        // Extract fields for default locale
        const fields = Object.keys(p.fields).reduce((acc, key) => {
            acc[key] = p.fields[key][locale] || Object.values(p.fields[key])[0];
            return acc;
        }, {});
        return {
            sys: { id: p.sys.id },
            fields: fields
        };
    }).sort((a, b) => (a.fields.order || 0) - (b.fields.order || 0));
    console.log(JSON.stringify(pricesMapped, null, 2));

    console.log("\n=== INFO BLOCKS FALLBACK DATA ===");
    const infoBlocksMapped = infoBlocks.items.map(b => {
        const fields = Object.keys(b.fields).reduce((acc, key) => {
            acc[key] = b.fields[key][locale] || Object.values(b.fields[key])[0];
            return acc;
        }, {});
        return {
            sys: { id: b.sys.id },
            fields: fields
        };
    });
    console.log(JSON.stringify(infoBlocksMapped, null, 2));
}

run().catch(console.error);
