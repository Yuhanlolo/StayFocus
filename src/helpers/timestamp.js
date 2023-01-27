function timestamp()
{
    let today = new Date();
    let present = new Date(today);
    let time = JSON.stringify(present);
    let hour = Number(time.substring(12,14)) + 8;
    let min = Number(time.substring(15,17));
    let sec = Number(time.substring(18,20));

    
    let timestamps = new Array();
    timestamps[0] = hour;
    timestamps[1] = min;
    timestamps[2] = sec;
}

export default timestamp;