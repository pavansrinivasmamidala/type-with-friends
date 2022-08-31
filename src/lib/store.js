// @ts-nocheck
import {  derived, writable } from "svelte/store";


export const response = writable({});

export const nick = writable("");

export const wordsArray = derived(response, ($response) => {
    if($response.content){
        console.log($response.content.split('').join(''));
        return $response.content.split('').join();
    }
    return [];
})


