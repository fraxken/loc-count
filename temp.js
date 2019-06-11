const locStats = require("./");

async function main() {
    const stats = await locStats("SlimIO");
    // do things...
}
main().catch(console.error);
