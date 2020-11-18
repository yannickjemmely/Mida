# How to integrate a Broker
MidaFX offers dedicated interfaces for integrating your broker organization in this framework
and make it available to all its users.

## Do I need to offer a specific back-end API?
No, MidaFX is not requiring brokers to offer any specific backend API.
For integrating your broker you can just use your actual API. You can communicate
with your servers though `HTTP`, `WebSocket` or anything you consider adapt.

## What do we need to do?
For making your broker available in this framework you need to implement 3 abstract classes,
`MidaBroker`, `MidaBrokerAccount` and `MidaPosition`.

You decide the method of authentication and communication with your servers inside the classes implementation.
The only requirement is to implement the classes above and their methods with their relative signatures
and make sure they are correctly responding.
