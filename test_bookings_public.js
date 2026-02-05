async function testBookings() {
    const url = 'https://lojaky.noviapp.com.br/api/bookings?restaurantId=1e8cfe48-40d0-4a74-ba85-8408373715cb&_t=' + Date.now();
    console.log('Fetching:', url);
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.log('Error:', res.status, res.statusText);
            const txt = await res.text();
            console.log(txt); // The detailed error message
        } else {
            console.log('Success!');
            const json = await res.json();
            console.log('Count:', json.length);
        }
    } catch (e) {
        console.error(e);
    }
}

testBookings();
