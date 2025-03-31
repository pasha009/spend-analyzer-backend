export async function createAction(formData : any){
    console.log(formData);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    console.log(username);
    console.log(password);
}