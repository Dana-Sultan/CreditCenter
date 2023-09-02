Credits Center Quiz
In this quiz we are implementing a credits center that supports multiple credit scores. Any credit has its own symbol and it is a unique identifier, and has a balance for each user.
Each HTTP request should include the header property “USERID” aka “sender”, that is used as authentication for the HTTP request.
We use symbols as unique identifiers for credits. Each credit has an associated owner (by USERID) that has advanced permissions. Each endpoint gets symbol and “USERID” and
handle
requests as follow:
1. deploy(symbol) - creates a new credit score ledger with symbol as its unique identifier. It makes the “sender” as the credit’s “owner”.
2. mint(symbol, to, amount) - increase the balance of user (identified by “to”) by amount
3. burn(symbol, to, amount) - decrease the balance of user (identified by “to”) by amount
4. balanceOf(symbol, user) - returns the current balance of a user
5. totalSupply(symbol) - returns the current total amount of all users together
6. transfer(symbol, to, amount) - transfer credits from sender to other user (to), amounts indicated for the amount to be transferred.

Nice to have:
7. approve(symbol, to, amount) - delegates credits approval. In this case the sender gives
permissions to transfer via a third party.
8. allowance(symbol, from, to, amount) - the actual amount of delegation allowed.
9. transferFrom(credit, from, to, amount) - use approvals / delegations for transfer.

Notes:
● Mint & Burn allowed by credit owner only
● Negative amounts are illegal
● Negative balances are illegal
● transferFrom can be taken only if sufficient credit were delegated
● Gives informative message responses where it needed
An example starts next page >>
         
 Example: pay attention to all following 9 requests and responses —-------------------
1. Deploy new credit:
POST /deploy HTTP/1.1 Content-Type: application/json USERID: alice
{ }
“symbol”: “MYC”
expected outcome: true —-------------------—-------------------
2. Check balance
POST /balanceOf HTTP/1.1 Content-Type: application/json USERID: alice
{
“symbol”: “MYC”,
“user”: “bob” }
expected outcome: 0 —-------------------
3.
POST /mint HTTP/1.1 Content-Type: application/json USERID: alice
{
}
“symbol”: “MYC”, “to”: “bob”, “amount”: 65
expected outcome: true —-------------------
4.
POST /mint HTTP/1.1 Content-Type: application/json USERID: alice
{
“symbol”: “MYC”, “to”: “bob”, “amount”: 35

 }
expected outcome: true —-------------------
5. Check balance
POST /balanceOf HTTP/1.1 Content-Type: application/json USERID: alice
{
“symbol”: “MYC”,
“user”: “bob” }
expected outcome: 100 —-------------------
6. Transfer credits
POST /transfer HTTP/1.1 Content-Type: application/json USERID: bob
{
}
“symbol”: “MYC”, “to”: “charlie”, “amount”: 87
expected outcome: true —-------------------—------------------- 7. Check balance
POST /balanceOf HTTP/1.1 Content-Type: application/json USERID: alice
{
“symbol”: “MYC”,
“user”: “bob” }
expected outcome: 13 —-------------------
8. Check balance
POST /balanceOf HTTP/1.1 Content-Type: application/json USERID: alice
{
“symbol”: “MYC”,

 “user”: “charlie”
}
expected outcome: 87
—-------------------—-------------------
9. Insufficient balance transfer failure POST /transfer HTTP/1.1 Content-Type: application/json USERID: bob
{
}
“symbol”: “MYC”, “to”: “charlie”, “amount”: 14
expected outcome: false
______________________
Notice that last request (number 7) returns false because of insufficient balance