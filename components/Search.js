// Components/Search.js
import React from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    Button,
    FlatList,
    ActivityIndicator
} from 'react-native'

import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText} from '../API/TMBDApi';
import { connect } from 'react-redux'
import FilmList from "./FilmList";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.page =0
        this.totalPages =0
        this.state = {
            films: [],
            isLoading: false
        }
        this.searchedText = ""
        this._loadFilms= this._loadFilms.bind(this)
    }




    _loadFilms() {
        this.setState({isLoading : true}) //lancement du chargement
        if(this.searchedText.length > 0){
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data =>{
               this.page = data.page
                this.totalPages = data.total_pages
                this.setState({
                    films: [... this.state.films,...data.results] ,
                    isLoading: false //arret du chargement
                })
            })
        }

    }


    _displayLoading(){
        if(this.state.isLoading){
            return (
                <View style={ styles.loading_container}>
                    <ActivityIndicator size ='large'/>
                </View>
            )
        }
    }


    _searchTextInputChanged(text){
        this.searchedText = text
    }

    _searchFilms(){
        this.page =0
        this.totalPages =0
        this.setState({
            films:[]
        },()=> {
            console.log("Page : " + this.page + " / totalpages : " + this.totalPages + " / nombre de films " + this.state.films.length)
            this._loadFilms()
        })


    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail", {idFilm : idFilm})
    }

    render() {
        console.log(this.state.isLoading)
        return (
            <View style={styles.main_container}>
                <TextInput
                    style={styles.textinput}
                    placeholder='Titre du film'
                    onChangeText = {(text)=> this._searchTextInputChanged(text)}
                    onSubmitEditing={()=> this._searchFilms()}
                />
                <Button title='Rechercher'  onPress={() => this._searchFilms()}/>
                <FilmList
                    films = {this.state.films}
                    navigation={ this.props.navigation}
                    loadFilms={this._loadFilms}
                    page={this.page}
                    totalPages={this.totalPages}
                />
                {this._displayLoading()}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    main_container : {
        flex: 1
    },
    loading_container:{
        position : 'absolute',
        left : 0,
        right :0,
        top: 100,
        bottom:0,
        alignItems : 'center',
        justifyContent:'center'

    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    }
})
// On connecte le store Redux, ainsi que les films favoris du state de notre application, à notre component Search
const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(Search)