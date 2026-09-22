"use client"; // 👈 Mark this file as client-side

export default function NewSales() {
  function handleSubmit(e:any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const degC = formData.get("degC");
    alert(`It was '${degC}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="degC" />
      <input name="icecream" />
      <input name="coffee" />
      <button type="submit">Add</button>
    </form>
  );
}