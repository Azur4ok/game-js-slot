export async function fetchData() {
    const response = await fetch('../data/data.json');
    return await response.json();
  }