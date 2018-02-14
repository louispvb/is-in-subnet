import * as IPv6 from '../src/ipv6';
import test from 'ava';

const ipv6Tests: [string, string, boolean][] = [
  ['2001:db8:f53a::1', '::/0', true],
  ['2001:db8:f53a::1', '2001:db8:f53a::1:1/64', true],
  ['2001:db8:f53a::1', '2001:db8:f53b::1:1/48', false],
  ['2001:db8:f53a::1', '2001:db8:f531::1:1/44', true],
  ['2001:db8:f53a::1', '2001:db8:f500::1/40', true],
  ['2001:db8:f53a::1', '2001:db8:f500::1%z/40', true],
  ['2001:db8:f53a::1', '2001:db9:f500::1/40', false],
  ['2001:db8:f53a::1', '2001:db9:f500::1%z/40', false],
  ['2001:db8:f53a:0:0:0:0:1', '2001:db8:f500:0:0:0:0:1%z/40', true]
];

test('ipv6 subnet membership (one-at-a-time)', async t => {
  ipv6Tests.forEach(([ip, subnet, expected]) => {
    t.is(IPv6.isInSubnet(ip, subnet), expected);
  });
});

test('ipv6 subnet membership (array)', async t => {
  const ip = ipv6Tests[0][0];
  const inSubnets = ipv6Tests.filter(t => t[0] === ip && t[2]).map(t => t[1]);
  t.is(IPv6.isInSubnet(ip, inSubnets), true);

  const notInSubnets = ipv6Tests.filter(t => t[0] === ip && !t[2]).map(t => t[1]);
  t.is(IPv6.isInSubnet(ip, notInSubnets), false);
});

test('invalid subnets', async t => {
  t.throws(() => IPv6.isInSubnet('2001:db8:f53a::1', '2001:db8:f53a::1'));
  t.throws(() => IPv6.isInSubnet('2001:db8:f53a::1', '2001:db8:f53a::1/-1'));
  t.throws(() => IPv6.isInSubnet('2001:db8:f53a::1', '2001:db8:f53a::1/129'));
});

test('invalid ipv6', async t => {
  t.throws(() => IPv6.isInSubnet('10.5.0.1', '2001:db8:f53a::1:1/64'));
});

test('ipv6 localhost', async t => {
  t.is(IPv6.isLocalhost('::1'), true);
  t.is(IPv6.isLocalhost('::2'), false);
});

test('ipv6 private', async t => {
  t.is(IPv6.isPrivate('::1'), false);
  t.is(IPv6.isPrivate('fe80::5555:1111:2222:7777%utun2'), true);
  t.is(IPv6.isPrivate('fdc5:3c04:80bf:d9ee::1'), true);
});

test('ipv6 mapped', async t => {
  t.is(IPv6.isIPv4MappedAddress('::1'), false);
  t.is(IPv6.isIPv4MappedAddress('fe80::5555:1111:2222:7777%utun2'), false);
  t.is(IPv6.isIPv4MappedAddress('::ffff:192.168.0.1'), true);

  // THIS FORMAT IS DEPRECATED AND WE DO NOT SUPPORT IT: SEE RFC5156 SECTION 2.3
  // https://tools.ietf.org/html/rfc5156#section-2.3
  t.throws(() => IPv6.isIPv4MappedAddress('::192.168.0.1'));
});

test('ipv6 reserved', async t => {
  t.is(IPv6.isReserved('2001:db8:f53a::1'), true);
  t.is(IPv6.isReserved('2001:4860:4860::8888'), false);
  t.is(IPv6.isReserved('::'), true);
});

test('ipv6 special', async t => {
  t.is(IPv6.isSpecial('2001:4860:4860::8888'), false);
  t.is(IPv6.isSpecial('::1'), true);
  t.is(IPv6.isSpecial('::ffff:192.168.0.1'), false);
  t.is(IPv6.isSpecial('2001:db8:f53a::1'), true);
});
