// Require Third-party Dependencies
const repos = require("repos");
const { get } = require("httpie");
const argc = require("@slimio/arg-checker");
const is = require("@slimio/is");

async function locStats(user, options = Object.create(null)) {
    argc(user, is.string);
    argc(options, is.plainObject);

    const { repo, byKind } = options;
    argc(repo, [is.string, is.nullOrUndefined]);
    argc(byKind, [is.string, is.nullOrUndefined]);

    if (is.nullOrUndefined(repo)) {
        const repositoriesNames = (await repos(user)).map((row) => row.full_name);

        console.log("Getting stats from all projects!");
        const stats = await Promise.all(
            repositoriesNames.map((name) => get(`https://api.codetabs.com/v1/loc?github=${name}`))
        );
        
        console.log("Calculating loc...");
        let loc = 0;
        for (const repository of stats) {
            for (const item of repository) {
                loc += Number(item.linesOfCode);
            }
        }

        return loc;
    }
    else {
        const { data } = await get(`https://api.codetabs.com/v1/loc?github=${user}/${repo}`);
        if (is.nullOrUndefined(byKind) && Reflect.has(data, byKind)) {
            return data[byKind];
        }

        return data;
    }
}

module.exports = locStats;