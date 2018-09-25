import React, {Component} from "react"
import {HashRouter as Router, Route, Switch} from "react-router-dom"
import {Header, Introduction, Share} from "./components.js"
import {Provider} from "mobx-react"
import stores from "../stores"

class ROOT extends Component {
    render() {
        return (
            <Provider stores={stores}>
                <Router>
                    <div>
                        <Header />
                        <Switch>
                            <Route exact path="/" component={Introduction} />
                            <Route path="/home" component={Introduction} />
                            <Route path="/share" component={Share} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        )
    }
}

export default ROOT