import Boot from "./boot";

Boot.boot()
    .then(r => console.log("Successfully booted"))
    .catch(console.error);
