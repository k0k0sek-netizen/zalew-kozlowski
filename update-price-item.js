const contentful = require("contentful-management");

async function run() {
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment("master");
    
    let ct = await environment.getContentType("priceItem");
    
    // Add price1Rod
    if (!ct.fields.find(f => f.id === "price1Rod")) {
        ct.fields.push({
            id: "price1Rod",
            name: "Cena za 1 wędkę (Kalkulator)",
            type: "Integer",
            required: false,
        });
    }
    // Add price2Rods
    if (!ct.fields.find(f => f.id === "price2Rods")) {
        ct.fields.push({
            id: "price2Rods",
            name: "Cena za 2 wędki (Kalkulator)",
            type: "Integer",
            required: false,
        });
    }
    // Add priceSpinning
    if (!ct.fields.find(f => f.id === "priceSpinning")) {
        ct.fields.push({
            id: "priceSpinning",
            name: "Cena za spinning (Kalkulator)",
            type: "Integer",
            required: false,
        });
    }
    
    ct = await ct.update();
    ct = await ct.publish();
    console.log("Updated priceItem content type successfully.");
}

run().catch(console.error);
