import getDomain from '../helper/getDomain';

test('getDomain URLs válidas', () => {
  expect(getDomain('https://g1.globo.com/')).toBe('g1.globo.com');
  expect(
    getDomain(
      'https://g1.globo.com/economia/censo/noticia/2024/09/06/censo-brasil-tem-57-mil-pessoas-morando-em-tendas-e-barracas-e-19-mil-em-veiculos.ghtml'
    )
  ).toBe('g1.globo.com');
  expect(getDomain('http://portal.mec.gov.br/')).toBe('portal.mec.gov.br');
  expect(getDomain('https://www.example.com')).toBe('www.example.com');
  expect(getDomain('https://example.com:8080')).toBe('example.com');
  expect(getDomain('http://192.168.0.1')).toBe('192.168.0.1');
  expect(getDomain('https://user:pass@example.com')).toBe('example.com');
});

test('getDomain URLs inválidas', () => {
  expect(getDomain('chrome://extensions')).toBe(undefined);
  expect(getDomain('brave://settings')).toBe(undefined);
  expect(getDomain('file://localhost/path/to/file')).toBe(undefined);
  expect(getDomain('http:/malformed.com')).toBe(undefined);
  expect(getDomain('')).toBe(undefined);
  expect(getDomain(undefined)).toBe(undefined);
  expect(getDomain('mailto:someone@example.com')).toBe(undefined);
});
