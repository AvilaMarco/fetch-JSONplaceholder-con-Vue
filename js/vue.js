Vue.component("user-card", {
  props: {
    userData: Object,
  },
  template: `
  <div class="card h-100">
    <img src="https://picsum.photos/100" class="card-img-top h-50" alt="user" />
    <div class="card-body">
      <h5 class="card-title">{{userData.name}}</h5>
      <p class="card-text">{{userData.email}}</p>
      <ul>
        <li>
          <a 
            :href="userData.website" 
            target="_blank"
          >
            Website
          </a>
        </li>
        <li>Phone: {{userData.phone}}</li>
        <li>City: {{userData.address.city}}</li>
      </ul>
      <button @click="toDelete" class="btn btn-block btn-danger">Delete</button>  
    </div>
  </div>`,
  methods: {
    toDelete() {
      this.$emit("delete", this.userData.id);
    },
  },
});

const app = new Vue({
  el: "#app",
  data: {
    users: [],
    cantUser: 0,
    apiLink: "https://jsonplaceholder.typicode.com",
  },
  created() {
    this.fetchUser();
  },
  watch: {
    users(value) {
      this.cantUser = value.length;
    },
  },
  methods: {
    fetchUser(user) {
      console.log(user);
      if (user != undefined) this.users.push(user);
      else
        fetch(`${this.apiLink}/users`)
          .then((response) => response.json())
          .then((users) => (this.users = users));
    },
    postUser(body) {
      return fetch(`${this.apiLink}/users`, {
        method: "POST",
        body: body,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then((response) => response.json());
    },
    AddUser(ev) {
      const form = new FormData(ev.target);
      const fomrBody = JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        address: { city: form.get("city") },
        phone: form.get("phone"),
        website: form.get("website"),
      });
      this.postUser(fomrBody).then((user) => this.fetchUser(user));
      ev.target.reset();
    },
    deleteUser(id) {
      // borro el usuario de la base de datos
      fetch(`${this.apiLink}/users/${id}`, { method: "DELETE" });

      // borro al usuario de manera local
      this.users = this.users.filter((user) => user.id != id);
    },
  },
  computed: {
    usersData() {
      return this.users.filter((user, i) => i <= this.cantUser - 1);
    },
  },
});
