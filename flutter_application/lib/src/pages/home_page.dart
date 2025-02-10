import 'package:flutter/material.dart';

void main() => runApp(const HomePage());


class HomePage extends StatelessWidget {
  const HomePage({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.black,
          foregroundColor: Colors.white,
          title: const Text('App Bar'),
        ),
        body: const Center(
          child: Text('Hello World'),
        ),
        bottomNavigationBar: BottomAppBar(
          //foregroundColor: Colors.white,
          //backgroundColor: Colors.blue,
          child: Text('Navigation Bottom'),
        ),
      ),
    );  
  }
}