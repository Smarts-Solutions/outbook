
export const Email_regex = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outbooks|outbook|rediffmail|hotmail|outlook|aol|icloud|protonmail|b2s2.uk|example|dnscloudcore|myexperts|myexpert)\.(com|co\.in|in|net|org|edu|gov|uk|us|info|biz|io|...|co\.uk|solutions|solution)[a-zA-Z]{0,}$/;
    return emailRegex.test(email);
}
export const Mobile_regex = (mobile) => {
    const MobileRegex = /^[0-9]{10}$/
    return MobileRegex.test(mobile);

}
 


 
