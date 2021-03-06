# bitcoin-closure
*A project by <a href="http://serenarandolph.com" target="_blank">Serena Randolph</a> and <a href="https://onename.com/austinwilliams" target="_blank">Austin Williams</a>*

**bitcoin-closure** is a tool for computing the closure of a bitcoin address.

## What is the Closure of a Bitcoin Address?
The closure of a bitcoin address is defined recursively as follows:

1. An address is contained in its own closure.
2. If address A is in the closure, and there exists a transaction using coins from address A and address B as inputs, then address B is also in the closure.

The motivation is that if two addresses appear together as inputs in some transaction, then the two addresses are very likely to be controlled by the same entity. **As a result, all of the addresses in the closure of an address are very likely owned by the same entity***.

This linking was noted by Satoshi Nakamoto in the <a href="https://bitcoin.org/bitcoin.pdf" target="_blank">Bitcoin whitepaper</a> (page 6):
> “Some linking is still unavoidable with multi-input transactions, which necessarily
reveal that their inputs were owned by the same owner. The risk is that if the owner
of a key is revealed, linking could reveal other transactions that belonged to the
same owner.”


You can read more about closures at these links:

* <a href="https://docs.google.com/viewer?url=http%3A%2F%2Ffc13.ifca.ai%2Fproc%2F1-3.pdf" target="_blank">Evaluating User Privacy in Bitcoin</a>
* <a href="https://docs.google.com/viewer?url=http%3A%2F%2Fcseweb.ucsd.edu%2F~smeiklejohn%2Ffiles%2Fimc13.pdf" target="_blank">A Fistful of Bitcoins: Characterizing Payments Among Men with No Names</a>
* <a href="http://arxiv.org/abs/1107.4524" target="_blank">An Analysis of Anonymity in the Bitcoin System</a>
* <a href="https://bitcoinmagazine.com/6630/trustless-bitcoin-anonymity-here-at-last/" target="_blank">Trustless Bitcoin Anonymity Here at Last</a>


(*) There are important exceptions. Coinjoin transactions, for example, contain inputs from three or more distinct entities -- yet all the addresses used as inputs to a coinjoin transaction are contained in the same closure.

## Getting Started

### JavaScript Web Interface
We're hosting a working implementation online <a href="http://projectawesomeproject.com/projects/bitcoin-closure/" target="_blank">here</a>, so feel free to check that out.

Otherwise, you can run the application from your own computer as follows.

Grab the files from this repo:

`$ git clone https://github.com/sharkcrayon/bitcoin-closure`

Dig into the javascript folder:

```
$ cd bitcoin-closure
$ cd javascript
```

Then open the `index.html` file in your browser and enter a bitcoin address.

### Python Command Line Tool
Grab the files from this repo:

`$ git clone https://github.com/sharkcrayon/bitcoin-closure`

Dig into the python folder:

```
$ cd bitcoin-closure
$ cd python
```

Then to find the closure of an address just use the following command from command line:

`$ python closure.py 'address'`

As a good first example, try this command:

`$ python closure.py 1M8s2S5bgAzSSzVTeL7zruvMPLvzSkEAuv`

And <a href="http://www.theopenledger.com/9-most-famous-bitcoin-addresses/" target="_blank">here is a list</a> of some fun addresses to play around with.

### Troubleshooting

It can be slow (it takes time for the API at insight.bitpay.com to respond).

Most errors are caused by:

(1) invalid input address or

(2) timeouts (slow internet speeds can result in timeout errors) or

(3) API rate limiting (the API will stop responding if you call it too many times too quickly, or make the same calls several times in a row).

### Some Thoughts About Closures
Let **X** be the set of all bitcoin addresses.
We will write A ~ B whenever bitcoin address A is in the closure of bitcoin address B.

The following properties hold for the relation ~ defined on the set of all bitcoin addresses, and are easy to prove from the definition of closure:

**Reflexive**: ∀A ∈**X**, A~A. 

**Symmetric**: ∀A,B ∈ **X**, A~B ⇒ B~A.

**Transitive**: ∀A,B,C ∈**X**, A~B & B~C ⇒ A~C

Thus ~ induces an <a href="https://en.wikipedia.org/wiki/Equivalence_relation" target="_blank">equivalence relation</a> on **X**. It follows that the set of all bitcoin addresses can be partitioned into closures of addresses.

For those researchers doing blockchain analysis, it may be useful to consider whether your analysis can be extended from individual bitcoin addresses to entire closures. For example, rather than simply analysing the traditional bitcoin-transaction graph, you may also want to study the closure-transaction graph -- where the vertices are bitcoin closures and there exists a directed edge from _closureA_ to _closureB_ if any address in _closureA_ has sent funds to any address in _closureB_.

### Donate

If you like the project please donate a few bits to <a href="https://www.blockchain.info/address/17fEqNTUuot3FoDaR5YrCAVwpGRNn8zJDU" target="_blank">17fEqNTUuot3FoDaR5YrCAVwpGRNn8zJDU</a>. 

Here's the QRC:

![Image of QRC for 17fE...](https://raw.githubusercontent.com/sharkcrayon/bitcoin-closure/master/qrc-donation.png) 
