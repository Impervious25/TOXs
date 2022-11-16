import React,{ useContext, useEffect, useRef } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { AuthenticationContext } from '../../../services/authentication/authentication.context';
import { RestaurantHistoryContext } from '../../../services/restaurant/orderHistory.context'
import styled from 'styled-components'
import { ActivityIndicator,Colors } from 'react-native-paper';
import { SafeArea } from '../../../utils/components/safe-area.components';
import { HistoryFilterComponent } from '../components/historyDropdown.components';
var randomstring=require("randomstring")

const Container = styled(View)`
    flex:1;
    background-color:${(props) => props.theme.background};
`;

const Head = styled(Text)`
    color:${props=>props.theme.text}
    text-align:center
    margin-vertical:${props=>props.theme.space[3]}
    font-family:${props=>props.theme.fonts.body}
    font-size:${props=>props.theme.fontSizes.h5}
`;

const Wrapper=styled(View)`
    background-color:${props => props.theme.colors.brand.basic};
    padding:${props=>props.theme.space[4]}
    margin:${props=>props.theme.space[2]}
    flex-direction:row;
    border-radius:${props=>props.theme.space[4]}
`;

const TextWrap = styled(Text)`
    color:black
    font-family:${props=>props.theme.fonts.heading}
    font-size:${props=>props.theme.fontSizes.body}
`;

const Empty=styled(Text)`
    color: ${props=>props.theme.text}
    text-align:center
    font-size:${props=>props.theme.fontSizes.title}
    padding-top:${props=>props.theme.space[6]}
    font-family:${props=>props.theme.fonts.body}
`;

const DropdownWrapper = styled(View)`
    background-color:${props=>props.theme.colors.ui.basic}
    padding:2px
    flex:0.45
    border-radius:${props=>props.theme.space[4]}
    margin-vertical:12px
`;

export const OrderHistory = ({ navigation }) => {

    const { history, isLoading, Search, SearchByStatus } = useContext(RestaurantHistoryContext)
    const { user } = useContext(AuthenticationContext) 
    const status=useRef()

    useEffect(()=>{
        if(user.type=="users")
        {
            Search(user.email,user.type)
        }else{
            Search(user.userName,user.type)
        }
    },[])

    const options=[
        { label: 'Not Ready', value: 'Not Ready' },
        { label: 'Ready', value: 'Ready' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Select All', value: 'Select All' }
    ]

    const renderItem = (item) => {
        return(
            <TouchableOpacity activeOpacity={0.65} onPress={()=>navigation.navigate("OrderDetail",{item:item.item})}>
                <Wrapper>
                    <View style={{flex:0.5}}>
                        <TextWrap>{item.item.restaurant} order</TextWrap>
                    </View>
                    <View style={{flex:0.2}}>
                        <TextWrap>₹{item.item.amount}</TextWrap>
                    </View>
                    <View style={{flex:0.3}}>
                        <TextWrap>{item.item.status}</TextWrap>
                    </View>
                </Wrapper>
            </TouchableOpacity>
        )
    }

    const render = () => {
        return(
            <>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:0.53}}>
                        <Head>My History</Head>
                    </View>
                    <DropdownWrapper>
                        <HistoryFilterComponent 
                        status={status} options={options} SearchByStatus={SearchByStatus} type={user.type} name={user.type=="users"?user.email:user.userName}/>
                    </DropdownWrapper>
                </View>
                {isLoading?
                (
                    <ActivityIndicator color={Colors.red400} size={50} style={{marginTop:50}} />
                ):
                (
                    history.length? 
                    (   
                        <FlatList 
                            data={history} 
                            renderItem={renderItem}
                            keyExtractor={(item)=>randomstring.generate()}
                        />
                    ):(
                        <Empty>No items found!!</Empty>
                    )
                )
                }
            </>
        )
    } 

    return(
        <Container>
            {user.type=="vendors"?
            (
                <SafeArea>
                    {render()}
                </SafeArea>
            ):
            (
                <>
                    {render()}
                </>
            )
            }
            
        </Container>
    )
}