str1="happyhapppybirthday"
str2="happyanniversary"
temp=""

for i in str1:
    if i not in str2:
        temp=temp+i
print(temp)