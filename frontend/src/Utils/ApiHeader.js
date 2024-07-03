export const header = (token) => {

    const header = {
        'Content-Type': 'application/json',
        "Authorization": token
    }
    return header
}