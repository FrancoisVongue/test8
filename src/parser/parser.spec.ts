import { YamlNode } from "./parser";

describe('YamlParser', () => {
    describe('fromLines', () => {
        it('should build a node from line input', () => {
            const example = [
                'user',
                '  name = john',
                '  cololr = blue',
                '  parent',
                '    name = andrew',
            ];
            
            const result = YamlNode.fromLines(example);
            expect(result[0].firstLine).toBe(example[0]);
            expect(result[0].children.length).toBe(3);
            expect(result[0].children[2].firstLine).toBe('parent');
        })
    })
})