# subnet-check

This is a fork which works independantly of node.js to be able to be used in the browser.

Check if an IPv4 or IPv6 address is contained in the given [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) subnet.

* Small
* Fast
* Simple syntax
* Full test coverage
* TypeScript-friendly
* Zero dependencies

## Installation

`npm i -S louispvb/subnet-check`

## Usage

```javascript
const { isInSubnet } = require('subnet-check');

console.log( isInSubnet('10.5.0.1', '10.4.5.0/16') );   // false
console.log( isInSubnet('10.5.0.1', '10.4.5.0/15') );   // true

console.log( isInSubnet('2001:db8:f53a::1', '2001:db8:f53b::1:1/48') );   // false
console.log( isInSubnet('2001:db8:f53a::1', '2001:db8:f531::1:1/44') );   // true
```

## More ways to use it

### Test multiple subnets at once

You can pass an array instead of a single subnet.

```javascript
const inAnySubnet = isInSubnet('10.5.0.1', [ '10.4.5.0/16', '192.168.1.0/24' ]);
```

This module recognizes several special classes of addresses.

### Private addresses

```javascript
isPrivate(address);
```

True if the address is in a private/internal address range, such as `192.168.1.1` or similar, or an IPv6 Unique Local Address.

### Localhost addresses

```javascript
isLocalhost(address);
```

True if the address represents the localhost, such as `127.0.0.1` or `::1`.
