

class DeleteButtonComponent extends HTMLElement
{
    constructor() 
    {
        super();
    }

    initialize(listItemName, serverRoute)
    {
        this.listItemName = listItemName;
        this.serverRoute = serverRoute;
    }

    connectedCallback()
    {
        this.innerHTML = `
            <button class="list-component-delete-button">
             <img src="../Assets/deleteButtonIcon.jpg" height=30 width=25></img></button>
        `;

        // const deleteButton = this.querySelector(".list-component-delete-button");
        this.addEventListener("click", async (event) =>
        {
            event.preventDefault();

            alert(`${this.listItemName} is about to be deleted!`);
        
            try {
                const response = await fetch(`http://localhost:3000${this.serverRoute}/byDetails`, {
                    method: "DELETE",
                    headers:{"Content-Type":"application/json"},
                    // body: JSON.stringify({productName})
                    body: JSON.stringify({productName: this.listItemName})
                });

                const result = await response.json();
                alert(result.message || "Product deleted!");

                this.dispatchEvent(new CustomEvent("item-deleted", {
                    bubbles: true,
                    composed: true,
                    detail: { name: this.listItemName }
                }));

            }
            catch(error) {
                console.error("Error while deleting the product:",error.message);
            }
        });
    }
}

customElements.define("delete-button-component", DeleteButtonComponent);
export default DeleteButtonComponent;