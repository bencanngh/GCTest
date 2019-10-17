import _ from "lodash";

const services = ["$http", "$q", "$document"];

const template = /* html */ `
  <div class="app">
    <div class="padded header">
          <md-input-container>
              <md-select class="select-user" ng-model="$ctrl.selectedUser">
                  <md-option ng-value="user" ng-repeat="user in $ctrl.users">{{ user.name }}</md-option>
              </md-select>
          </md-input-container>
          <button class="button-search md-raised" ng-disabled="!$ctrl.selectedUser" ng-click="$ctrl.queryUser()">Select</button>
    </div>
    
    <div class="main" flex layout="rows">

      <div class="padded posts" flex="50" layout="column">
          <div class="post" ng-repeat="post in $ctrl.posts">
            <h3>{{ post.title }}</h3>
            <p>{{ post.body }}</p>
          </div>
      </div>

      <div class="padded detail" flex="50" layout="column">
        <table align="center">
          <tr>
            <th>Word</th>
            <th>% of all comments</th>
          </tr>
          <tr ng-repeat="word in $ctrl.wordCount">
            <td>{{ word.word }}</td>
            <td>{{ word.percentage }}</td>
          </tr>
        </table>

        
        <canvas id="canvas"></canvas>
      </div>

      </div>

      

    </div>
  </div>
`;

const controller = class AppComponent {
  static $inject = services;

  constructor(...args) {
    _.each(services, (service, index) => {
      this[service] = args[index];
    });
  }

  $onInit() {
    this.getUsers();
  }

  getUsers() {
    this.$http
      .get("https://jsonplaceholder.typicode.com/users")
      .then(result => {
        this.users = result.data;
      });
  }

  queryUser() {
    const handleGetUserPosts = (result => {
      const totalWords = result.length;
      this.wordCount = _.orderBy(
        _.map(_.countBy(result), (key, value) => {
          return {
            word: value,
            count: key,
            percentage: ((Number(key) / totalWords) * 100).toFixed(2)
          };
        }),
        ["count"],
        ["desc"]
      ).slice(0, 10);

      this.makeChart();
    }).bind(this);

    this.getUserPosts().then(handleGetUserPosts);
  }

  getUserPosts() {
    return this.$http
      .get(
        `https://jsonplaceholder.typicode.com/posts?userId=${this.selectedUser.id}`
      )
      .then(result => {
        this.posts = result.data;
        return this.getUserComments().then(result => {
          return _.join(result).split(" ");
        });
      });
  }

  getUserComments() {
    this.comments = [];
    return this.$q.all(
      _.map(this.posts, post => {
        return this.$http
          .get(
            `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`
          )
          .then(result => {
            const bodies = _.chain(result.data)
              .map(p => {
                return p.body.replace(/(?:\r\n|\r|\n)/g, "");
              })
              .join()
              .value();

            return bodies;
          });
      })
    );
  }

  makeChartData() {
    return {};
  }

  makeChart() {
    const myHorizontalBar = new Chart($("#canvas"), {
      type: "horizontalBar",
      data: {
        labels: _.map(this.wordCount, "word"),
        datasets: [
          {
            label: "Word Data",
            data: _.map(this.wordCount, "count")
          }
        ]
      },
      options: {
        elements: {
          rectangle: {
            borderWidth: 2
          }
        },
        responsive: true,
        legend: {
          position: "right"
        },
        title: {
          display: true,
          text: "Count of Top 10 Words"
        }
      }
    });
  }
};

export const AppComponent = { template, controller };
