import { PrismaClient } from "../../prisma/generated/prisma/index.js";
import countriesList from 'world-countries';

const prisma = new PrismaClient();

class MasterRepository {
    static async generateCountries() {
        const formmatedCountriesData = countriesList.map(country => {
            const root = country?.idd?.root || '';
            const suffixes = country?.idd?.suffixes?.[0] || [];

            return {
                name: country.name.common,
                isoCode: country.cca2,
                dialCode: `${root}${suffixes}`
            }
        }).filter(country => country.dialCode && country.isoCode);

        for (const country of formmatedCountriesData) {
            await prisma.countries.upsert({
                where: { iso_code: country.isoCode },
                update: {
                    name: country.name,
                    dial_code: country.dialCode
                }, 
                create: {
                    name: country.name,
                    iso_code: country.isoCode,
                    dial_code: country.dialCode
                },
            });
        }
    }
}

export default MasterRepository;
