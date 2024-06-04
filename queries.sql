SELECT * from EMPLOYEES; 

SELECT * FROM EMPLOYEES ORDER BY ID OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY;

insert into EMPLOYEES (First_Name, Last_Name, email, salary) values (?, ?, ?, ?);

delete from EMPLOYEES where email = ?;

update EMPLOYEES set First_Name = ?, Last_Name = ?, salary = ?, email = ? where email = ?;

SELECT * FROM EMPLOYEES WHERE First_name LIKE ? and Last_name LIKE ?;