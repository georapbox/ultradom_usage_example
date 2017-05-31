import {h, patch} from 'picodom'; // eslint-disable-line
import {names} from './dummy/names';
import randomName from './random-name';

const root = document.getElementById('root');

class Component {
  constructor() {
    this.element = null;
    this.oldNode = null;
    this.rootNode = null;
  }

  render(rootNode) {
    const _render = newNode => this.element = patch(rootNode || this.rootNode, this.element, this.oldNode, this.oldNode = newNode);
    return _render(this.view ? this.view(this.state) : '');
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: names.slice(0, 10).map(() => ({name: randomName(names), active: true}))
    };
  }

  handleChange(e, user) {
    user.active = !user.active;
    this.render();
  }

  onSubmit(e) {
    e.preventDefault();

    const ref = e.target.elements.username;

    this.state = Object.assign({}, this.state, {
      users: [...this.state.users, {name: ref.value, active: true}]
    });

    ref.value = randomName(names);
    ref.focus();

    this.render();
  }

  view(state) {
    return (
      <div class="row">
        <div class="col-md-12 mt-3 mb-3">
          <form class="form-inline" id="form" onsubmit={e => this.onSubmit(e)}>
            <input
              class="form-control"
              id="username"
              name="username"
              type="text"
              placeholder="Add User"
              value={randomName(names)}
              autofocus required />

            <input class="btn btn-primary" type="submit" value="Submit"/>
          </form>
        </div>

        <div class="col-md-6">
          <table class="table table-striped table-bordered table-hover table-sm">
            <thead class="thead-inverse">
              <tr>
                <th class="text-center">Active</th>
                <th class="text-center">Name</th>
              </tr>
            </thead>
            <tbody>
              {
                state.users.map(user => {
                  return (
                    <tr class={`${!user.active ? 'table-danger' : ''}`}>
                      <td class="text-center">
                        <label class="d-block">
                          <input
                            type="checkbox"
                            checked={user.active}
                            onchange={e => this.handleChange(e, user)} />
                        </label>
                      </td>
                      <td class="text-center">{user.name}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        <div class="col-md-6">
          <pre class="p-2">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}

const app = new App();

app.render(root);