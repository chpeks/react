class CollectionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            collections: [],
            show_modal: false,
            name: "",
            prefix: "",
            hosts: [],
            hosts71: [],
            thumbprint: "",
            rdp_template: null,
            rdp: null,
            rdp71: null,
            err: "",
        }

        this.LoadCollections = this.LoadCollections.bind(this);
        this.addCollection= this.addCollection.bind(this);
    }

    inputChange = (event, index) => {
        let value = event.target.value;
        let name = event.target.name
        if (event.target.files){
            value = event.target.files[0];
        }
        if (event.target.name === 'hosts' || event.target.name === 'hosts71'){
            const newInputs = [...this.state[name]];
            newInputs[index] = event.target.value;
            value = newInputs
            console.log(value)
        }
        this.setState({[name]: value})
    }

    LoadCollections(){
        this.setState({loading: true});
        fetch(CRM_ENDPOINT_BACKEND_URL + '/server_get_collections', {
            method: 'GET',
            headers: {}
        }).then(res => res.json())
            .then(
                result => {
                    this.setState({
                        loading: false,
                        collections: result.collections
                    })
                }
            );
    }

    componentDidMount() {
        this.LoadCollections()
    }

    addCollection(){
        let fd = new FormData();
        fd.append('name', this.state.name);
        fd.append('prefixdomain', this.state.prefix);
        fd.append('thumbprint', this.state.thumbprint);
        if (this.state.rdp){
            fd.append('rdp', this.state.rdp);
        }
        if (this.state.rdp71){
            fd.append('rdp71', this.state.rdp71);
        }
        let host = this.state.hosts.filter(input => input.trim() !== '');
        fd.append('host', host);
        let host71 = this.state.hosts71.filter(input => input.trim() !== '');
        fd.append('host71', host71);
        if (this.state.rdp_template){
            fd.append('rdp_template', this.state.rdp_template);
        }
        if (this.state.rdp_template){
            fd.append('rdp_template', this.state.rdp_template);
        }
        fetch(CRM_ENDPOINT_BACKEND_URL + '/server_add_collection', {
            method: 'POST',
            headers: {},
            body: fd
        }).then(res => res.json())
            .then(
                result => {
                    if (result.err){
                        this.setState({err: result.err})
                    }else {
                        this.setState({
                            show_modal: false,
                            hosts: [],
                            hosts71: [],
                        })
                        this.LoadCollections()
                    }

                }
            );
    }
    handleAddInput = () => {
        this.setState((prevState) => ({
            hosts: [...prevState.hosts, '']
        }));
    }

    handleAddInput71 = () => {
        this.setState((prevState) => ({
            hosts71: [...prevState.hosts71, '']
        }));
    }



    render() {
        if (this.state.loading) return <Loader align={"center"}/>
        return (
            <>
                <div className="col-md-6">
                    <button className="btn btn-block btn-outline-dark" style={{marginBottom: '10px', marginTop: '10px'}} onClick={()=>this.setState({show_modal: true})}>Добавить коллекицю</button>
                </div>
                {this.state.collections.map( collection => {
                    return <Collection onChange={this.LoadCollections} key={collection.id} collection={collection}/>
                })}

                <div className="col-md-6">
                    <button className="btn btn-block btn-outline-dark" style={{marginBottom: '10px'}} onClick={()=>this.setState({show_modal: true})}>Добавить коллекицю</button>
                </div>
                <Modal show={this.state.show_modal}
                       onHide={() => {
                           this.setState({show_modal: false})
                       }} size={"xl"} centered>
                    <Modal.Header closeButton={true}>
                        {this.state.err &&
                            <Modal.Title style={{color:'red'}}>{this.state.err}</Modal.Title>
                        }
                    </Modal.Header>
                    <div className="card-body" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className="w-100">
                            <label className="form-label">Название</label>
                            <input type="text" name="name" onChange={event => this.inputChange(event)} className="form-control"/>
                        </div>
                        <div className="w-100 d-flex flex-wrap align-items-end justify-content-end">
                            <button className="btn  btn-success" onClick={this.addCollection}>Сохранить</button>
                        </div>

                    </div>
                    <Modal.Body style={{height: window.innerHeight - 400}}>
                        <div className="card-body" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{width:'45%'}}>
                                <label className="form-label">Префикс</label>
                                <input type="text" name="prefix" className="form-control" onChange={event => this.inputChange(event)} style={{marginBottom:'10px'}}/>

                                <label htmlFor="formFileSm" className="form-label">RDP ссылка</label>
                                <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={event => this.inputChange(event)} style={{marginBottom:'2px'}}/>

                                <label className="form-label">Хосты</label>
                                <div style={{marginBottom:'10px'}}>
                                    {this.state.hosts.map((host, index)=> {
                                        return <input key={index} type="text" name="hosts" onChange={event=>this.inputChange(event, index)} defaultValue={host} className="form-control" />
                                    })}
                                </div>
                                <button className="btn btn-outline-dark" style={{marginBottom:'10px'}} onClick={this.handleAddInput}>+</button>

                                <div>
                                    <label htmlFor="formFileSm" className="form-label">Шаблоны RDP файла</label>
                                    <input className="form-control form-control-sm" id="formFileSm" onChange={event => this.inputChange(event)} type="file" style={{marginBottom:'2px'}}/>
                                </div>


                            </div>
                            <div style={{width: '1px', backgroundColor:'#e5e9f0'}}></div>
                            <div style={{width:'45%'}}>
                                <label className="form-label">Отпечаток</label>
                                <input type="text" name="thumbprint" className="form-control" onChange={event => this.inputChange(event)} style={{marginBottom:'10px'}}/>

                                <label htmlFor="formFileSm" className="form-label">RDP ссылка 7.1</label>
                                <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={event => this.inputChange(event)} style={{marginBottom:'2px'}}/>


                                <label className="form-label">Хосты 7.1</label>
                                <div style={{marginBottom:'10px'}}>
                                    {this.state.hosts71.map((host71, index) => {
                                        return <input key={index} type="text" name="hosts71" onChange={event=>this.inputChange(event, index)} defaultValue={host71} className="form-control" />
                                    })}
                                </div>
                                <button className="btn btn-outline-dark" style={{marginBottom:'10px'}} onClick={this.handleAddInput71}>+</button>

                            </div>

                        </div>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default CollectionsList
