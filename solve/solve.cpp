#include <bits/stdc++.h>

using namespace std;

int main()
{
int a,b;
cin>>a>>b;
for(int i=1;i<=a;++i){
if(i%2==1){
for(int j=1;j<=b;++j){
cout<<i<<" "<<j<<endl;
}
}
else{
for(int j=b;j>=1;--j){
cout<<i<<" "<<j<<endl;
}
}
}
return 0;
}