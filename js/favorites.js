import { GithubUsers } from "./GithubUsers.js"

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@Github-favorites:")) || []
    }

    delete(user){
        const filterEntry = this.entries.filter(entry => entry.login !== user.login)
        this.entries = filterEntry
        this.update()
        this.save()
    }

    save(){
        localStorage.setItem("@Github-favorites:", JSON.stringify(this.entries))
    }

    async add(username){
        try{

            const userExists = this.entries.find(user => user.login === username)

            if(userExists){
                throw new Error("Usuário já cadastrado!")
            }



            const user = await GithubUsers.search(username)
            
         if(user.login === undefined){
            throw new Error("Usuário não encontrado!")
        } 

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

        }catch(error){
            alert(error.message)
        }
        
    }

}

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.noneFavorites = this.root.querySelector(".noneFavorites")
        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('#input-search')

            this.add(value)
        }
    }

    update(){
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `imagem de ${user.name}`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = `/${user.login}`
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers
            row.querySelector(".remove").onclick = ( () => {
                const isOk = confirm("Tem certeza que deseja excluir?") 
                if(isOk){
                    this.delete(user)
                }
            })

            
            this.noneFavorites.classList.add("sr-only")

            this.tbody.append(row)
        })

        
    }

    createRow(){
        const tr = document.createElement('tr')
            tr.innerHTML = `<td class="user">
            <img src="https://github.com/maykbrito.png" alt="imagem do mayk">
            <a href="https://github.com/maykbrito" target="_blank">
            <p>Mayk Brito</p>
            <span>maykbrito</span>
            </a>
            </td>
            <td class="repositories">76</td>
            <td class="followers">9589</td>
            <td>
                <button class="remove">Remover</button>
            </td>`

            return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        })
        this.noneFavorites.classList.remove("sr-only")
    }













}
