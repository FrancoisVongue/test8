import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { YamlNode } from '../src/parser/parser';
import { ExchangeOffice } from '../src/entities/exchange-office';
import { Country } from '../src/entities/country';

const prisma = new PrismaClient()

async function main() {
    const seedFile = await readFile(`./prisma/seed.yaml`, {encoding: 'utf-8'});
    const seedFileLines = seedFile.split('\n');
    const rootNodes = YamlNode.fromLines(seedFileLines);

    const exchangeOfficeNodes = rootNodes.find(rn => rn.firstLine === 'exchange-offices')?.children ?? [];
    const exchangeOffices = exchangeOfficeNodes.map(eo => new ExchangeOffice(eo));

    const countryNodes = rootNodes.find(rn => rn.firstLine === 'countries')?.children ?? [];
    const countries = countryNodes.map(c => new Country(c));
    
    // clean db
    await prisma.country.deleteMany();
    await prisma.exchange.deleteMany();
    await prisma.rate.deleteMany();
    await prisma.exchangeOffice.deleteMany();
    
    // seed db
    for(const exchangeOffice of exchangeOffices) {
        const exchangeOfficeDbEntry = await prisma.exchangeOffice.create({
            data: {
                id: exchangeOffice.id,
                country: exchangeOffice.country,
                name: exchangeOffice.name,
            },
            select: {
                id: true
            }
        });

        console.log(`Created office db entry...`);
        
        if(exchangeOffice.exchanges?.length) {
            const exchangeDbEntries = await prisma.exchange
                .createMany({
                    data: exchangeOffice.exchanges.map(e => {
                        return {
                            ask: e.ask,
                            from: e.from,
                            to: e.to,
                            date: e.date,
                            officeId: exchangeOfficeDbEntry.id,
                        }
                    }),
                });
            
            console.log(`  Created ${exchangeDbEntries.count} exchanges...`);
        }

        if(exchangeOffice.rates?.length) {
            const ratesDbEntries = await prisma.rate
                .createMany({
                    data: exchangeOffice.rates.map(r => {
                        return {
                            date: r.date,
                            to: r.to,
                            from: r.from,
                            in: r.in,
                            out: r.out,
                            reserve: r.reserve,
                            officeId: exchangeOfficeDbEntry.id
                        }
                    })
                });

            console.log(`  Created ${ratesDbEntries.count} rates...`);
        }
        
    }
    
    const countriesDbBatch = await prisma.country.createMany({
        data: countries
    });
    
    console.log(`Created ${countriesDbBatch.count} country entries...`);
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })