import { YamlNode } from "../parser/parser";
import { ExchangeOffice } from "./exchange-office";

describe('Exchange-Office', () => {
    describe('constructor', () => {
        it('Should create an exchange office object from parser yaml file', () => {
            const yamlLines = [
                `exchange-office`,
                `    id = 1`,
                `    name = Exchanger 1`,
                `    country = UKR`,
                `    exchanges`,
                `        exchange`,
                `            from = EUR`,
                `            to = USD`,
                `            ask = 110`,
                `            date = 2023-04-24 22:55:33`,
                `        exchange`,
                `            from = USD`,
                `            to = UAH`,
                `            ask = 400`,
                `            date = 2023-04-24 22:55:33`,
                `    rates`,
                `        rate`,
                `            from = EUR`,
                `            to = USD`,
                `            in = 1.1`,
                `            out = 1`,
                `            reserve = 120000`,
                `            date = 2023-04-24 22:55:33`,
                `        rate`,
                `            from = USD`,
                `            to = UAH`,
                `            in = 1`,
                `            out = 40`,
                `            reserve = 150000`,
                `            date = 2023-04-24 22:55:33`,
            ];
            const [exchangeOfficeYamlNode] = YamlNode.fromLines(yamlLines);
            const exchangeOffice = new ExchangeOffice(exchangeOfficeYamlNode);
            
            expect(exchangeOffice.id).toBe(1);
            expect(exchangeOffice.exchanges?.[0]?.ask).toBe(110);
            expect(exchangeOffice.rates?.[1]?.reserve).toBe(150000);
        })
    })
})