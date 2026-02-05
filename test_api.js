async function testSlots() {
    const url = 'https://lojaky.noviapp.com.br/api/bookings/available-slots?restaurantId=1e8cfe48-40d0-4a74-ba85-8408373715cb&date=2026-02-04';
    console.log('Fetching:', url);
    try {
        const res = await fetch(url + `&_t=${Date.now()}`); // Bypass cache
        if (!res.ok) {
            console.log('Error:', res.status, res.statusText);
            const txt = await res.text();
            console.log(txt);
            return;
        }
        const data = await res.json();
        console.log('--- Slots for 2026-02-04 ---');
        console.log('Date:', data.date);
        console.log('Count:', data.available?.length);
        console.log('First 5:', data.available?.slice(0, 5));
    } catch (e) {
        console.error(e);
    }
}

testSlots();
