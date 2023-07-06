const Drinks = require("../models/drinks");
const { v4: uuid } = require('uuid');

async function checkUUIDs(verbose) {
    return Drinks.find({}, 'uuid')
        .then(async (data) => {
            let uuidsToDefine = [];
            let allUUIDs = [];
            data.forEach((drink) => {
                if (!drink.uuid) {
                    uuidsToDefine.push(drink._id.toString());
                } else {
                    allUUIDs.push(drink.uuid);
                }
            });

            if (allUUIDs.length !== new Set(allUUIDs).size) {
                console.error('DUPLICATE UUIDs');
            }

            if (uuidsToDefine.length > 0) {
                console.log(`Defining ${uuidsToDefine.length} UUIDs...`);
                for (const drinkID of uuidsToDefine) {
                    await Drinks.updateOne({_id: drinkID}, {uuid: uuid()})
                        .then((res) => {
                            if(res.acknowledged) {
                                console.log('UUID added for database item: '+drinkID);
                            } else {
                                console.error('Failed to add UUID for database item: '+drinkID);
                            }
                        });
                }
            } else if (verbose) {
                console.log('No missing UUIDs')
            }
        });
}

module.exports = {
    validateDatabase: async function (verbose) {
        console.log('Validating Database...');
        await checkUUIDs(verbose);
        //TODO: Make this read something different if the validation fails
        console.log('Database validation complete.')

    }
}
