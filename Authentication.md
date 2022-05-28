# Token Based Authentication

I took inspiration from the `Openweather API` and `GitHub API` and how they ask their users to send token with each request. I tried implementing the same in my code as well.

When the system gets the information from the user, it verifies all the info and stores the data in the database. During the saving process, it provides a unique token to the user. In future, the user is required to send us the token with each subsequent requests they make.

### Storing the token in the Angular application
Here `user_type = '1'` specifies teacher, and `user_type = '0'` specifies student
```
localStorage.setItem('email_id', res.email_id);
localStorage.setItem('token', res.token);
localStorage.setItem('user_type', '1');
```
The angular application automatically finds these values from the `local_storage` and appends it to he body with each request.

<hr />

### Checking if the user is already logged in then directing them to dashboard instead of the landing page
```
if (localStorage.getItem("token") != null && localStorage.getItem("email_id") != null && localStorage.getItem("user_type")  != null) {
    if (localStorage.getItem("user_type") === '1'){
    this.toastr.success("Logged in as : " + localStorage.getItem("email_id"));
    this.router.navigate(['admin/dashboard']);
    }
    else {
    this.router.navigate(['student/dashboard']);
    }
}
```

<hr />

### Storing the token in our server
Tokens are stored in the Token table with the following schema.
| Columns | Type     | unique | nullable
| :-------- | :------- | :------------------------- |:------------------------- 
| `PK` id | `Integer` | `True` | `False` |
| `PK` review| `String` | `False` | `False` |

Here, `PK` stands for primary key
<br />

The python code. We generate a random 16 char long string and then generate then generate its hash.  The hash will be used as token and is stored in the database with the command `db.session.add(new_token)` and `db.session.commit()` later.
```
x = ''.join(random.choice('0123456789ABCDEF') for i in range(16))
token = hashlib.sha256(x.encode()).hexdigest()
new_token = Token(email_id, token, 1)
db.session.add(new_token)
```


<hr />

## License
- Licensed under [MIT](https://github.com/octajune/att-sejal/blob/main/LICENSE)

## Thank you Microsoft
I can't be more thankful to Microsoft for offering me this opportunity. I learnt a lot from the past 4 weeks.

<hr /><br />
<center>Made with ❤️ by Sejal</center>